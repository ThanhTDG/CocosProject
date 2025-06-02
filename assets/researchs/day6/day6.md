# 5 Design Patterns

---

## Command Pattern  
**What:**  
Encapsulate a request as an object, thereby allowing for parameterization of clients with different requests, queuing of requests, logging, and supporting undoable operations.  

**When:**  
Use when you want to decouple the object that invokes the operation from the one that knows how to perform it, such as implementing undo/redo, macro recording, or handling actions from menus, buttons, or keyboard shortcuts.  

**Do not use:**  
When actions are simple, do not need to be undone, queued, or logged, and when introducing command objects would make the code unnecessarily complex.

---

## Flyweight Pattern  
**What:**  
Use sharing to support a large number of fine-grained objects efficiently by minimizing memory usage. Flyweight objects share common data (intrinsic state) and store unique data (extrinsic state) externally.  

**When:**  
Use when you need to create a large number of similar objects that would otherwise consume too much memory, such as rendering many game tiles, particles, or characters with shared properties.  

**Do not use:**  
When the number of objects is small, or when objects cannot share state due to having too many unique properties.

---

## Observer Pattern  
**What:**  
Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.  

**When:**  
Use when you need to notify multiple objects about changes to another object, such as event systems, UI updates, or implementing publish-subscribe mechanisms (e.g., in-game event dispatchers, data-binding in UI).  

**Do not use:**  
When there are only a few objects to update, or when tight coupling between objects is acceptable, or when notification logic is simple and does not require extensibility.

---

## State Pattern  
**What:**  
Allow an object to change its behavior when its internal state changes. The object will appear to change its class.

**When:**  
Use when an object must change its behavior at runtime depending on its state, such as game character states (idle, running, jumping), UI button states (normal, hovered, pressed), or network connection states.  

**Do not use:**  
When the object's behavior is simple and does not depend on state, or when adding state management would make the code unnecessarily complex.

---

## Singleton Pattern  
**What:**  
Make sure one class has only one instance in the program's life cycle and can access it anywhere in the program.  

**When:**  
Use when need only one object to manage a shared resource, like: audio controller, game controller, config controller.

**Do not use:**  
When the object is only needed in a specific place or for a short time, or when having a global instance would make testing, maintenance, or code clarity more difficult. Avoid Singleton if you don't need global access or unique instance control.