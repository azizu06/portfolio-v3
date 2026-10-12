# Rehearse cover

`public/assets/project-previews/rehearse-cover.webp` is a real screenshot of the
running localhost interface, captured in signed-in Chrome at 1440 x 810 and
encoded as WebP. It is 21,384 bytes. It is not generated artwork or a dashboard
mockup. The proposed 3D illustration was rejected and is not shipped.

Source: [azizu06/rehearse](https://github.com/azizu06/rehearse), main commit
`413089f`, captured 2026-10-12 from a temporary clean source snapshot. The native
binary was built with the repository's `make build` command, served on loopback,
and returned `{"status":"ok"}` from `/api/v1/health` and `{"version":"dev"}`
from `/api/v1/version`.

The UI only displays its local control-plane connection. There are no drill
controls to demonstrate yet. The optional Grafana dashboard is provisioned, but
the native runtime does not execute drills, so its drill series remain at zero.
See the current [README](https://github.com/azizu06/rehearse/blob/413089f/README.md)
and [observability limits](https://github.com/azizu06/rehearse/blob/413089f/docs/observability.md).

The portfolio copy distinguishes tested component boundaries from the planned
end-to-end workflow. The repository-only link is labeled GitHub. Generated local
voice knowledge-base files are updated; the hosted agent is not published.
