dynamicDNS
==========

dynamic dns with node.
it works like this:

```bash
$ sudo node server.js
Listening on port 22023
DNS server started on port 53
```

Then just open a browser, go to
http://yourhost.com:22023/register
and your ip is set.

The dns server listening on port 53 will resolve every query it receives to that ip.

TODO
====
a lot.
