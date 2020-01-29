> # <span style="line-height : 60px"> Functions </span>
---
<div>
## log_messages( <span style="color:orange;font-style:italic"> object </span> )</span>

> Description

Print specific type of message (success / warning / error ) in the navigator console

> Usage
``` javascript
let object = {"type": _type, "message": "your message"}
```

*_type* :<span style="color:darkorange"> string </span>
<ul>
    <li style="font-size:90%;"> "succ" <span style="font-size:70%; font-style:italic"> (success) </span> </li>
    <li style="font-size:90%;"> "war" <span style="font-size:70%; font-style:italic"> (warning) </span> </li>
    <li style="font-size:90%;"> "err" <span style="font-size:70%; font-style:italic"> (error) </span> </li>
</ul>
``` javascript
log_messages( object );
```
---