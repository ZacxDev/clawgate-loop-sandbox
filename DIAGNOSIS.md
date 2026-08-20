# Metrics Scraper Auth Failure — Diagnosis

## Verbatim Response

All attempts against `http://metrics.internal.zacx.dev:9090/-/healthy` produced the same result — the host never resolved, so no HTTP connection was ever established and no HTTP status line or response body was received.

### Attempt 1 — with `$METRICS_API_TOKEN`

```
$ curl -v -s -H "Authorization: Bearer $METRICS_API_TOKEN" "http://metrics.internal.zacx.dev:9090/-/healthy"
* Could not resolve host: metrics.internal.zacx.dev
* Closing connection 0
```

### Attempt 2 — without auth header (control)

```
$ curl -v -s --connect-timeout 10 "http://metrics.internal.zacx.dev:9090/-/healthy"
* Could not resolve host: metrics.internal.zacx.dev
* Closing connection 0
```

### Attempt 3 — direct IP probe (cluster gateway)

```
$ curl -v -s --connect-timeout 5 http://10.244.0.1:9090/-/healthy
*   Trying 10.244.0.1:9090...
* connect to 10.244.0.1 port 9090 failed: Connection refused
```

### DNS server in use

```
$ cat /etc/resolv.conf
search devpod-brave-finch.svc.cluster.local svc.cluster.local cluster.local
nameserver 10.245.0.10
options ndots:5
```

The environment variable `$METRICS_API_TOKEN` is **not set** in the pod (zero-length / undefined).

---

## Diagnosis

**Root cause: `metrics.internal.zacx.dev` does not resolve in this cluster's DNS.**

The pod's DNS resolver (CoreDNS at `10.245.0.10`) returns `NXDOMAIN` (or equivalent) for `metrics.internal.zacx.dev`. Since the hostname is unresolvable, no TCP connection is made, no TLS handshake occurs, and no HTTP request is sent. The bearer auth token is irrelevant — it never had a chance to be presented.

**Three things are broken together:**

1. **DNS resolution** — `metrics.internal.zacx.dev` is not registered in cluster DNS, and the cluster has no upstream resolver that knows it. The domain `zacx.dev` also failed to resolve externally, suggesting this is a private/internal domain that should be served by the cluster DNS but isn't.

2. **No fallback connectivity** — Directly probing the cluster gateway IP (`10.244.0.1:9090`) returns `Connection refused`, meaning the metrics service is either not running, has a different cluster IP, or is in a different namespace without a ClusterIP service in `default`/`devpod-brave-finch`.

3. **Missing bearer token** — `$METRICS_API_TOKEN` is not set in the pod environment, so even if DNS worked, auth would fail as no token is being sent.

**To fix:** The metrics service needs a DNS record (likely a Kubernetes `Service` of type `ClusterIP` or `ExternalName`) in the cluster DNS zone so that `metrics.internal.zacx.dev` resolves from within the cluster. The token also needs to be injected into the pod environment (via a Secret mounted as an env var).