## SMVP

- SMVP (Share, Model, View, Psychology) - software design pattern
![SMVP](/assets/smvp.png)
- Share (Necessary to share data between views)
- Model (These are business objects)
- View (The interface that presents information to and accepts it from the user)
- Psychology (The use of cognitive and gestalt psychology in the form of the [rule](#rule) below)

### Rule

- Names of private methods created by "if" statements (Not in for/while/do while loops). They must contain the following information:
![Names of private methods created by "if" statements](/assets/names_of_private_methods_created_by_if_statements.png)
- Hierarchy (Hierarchy is needed to indicate the sequence of method calls.)
- Separator (A separator is needed to separate information such as hierarchy, action, context.)
- Action (The action is necessary to indicate where the logical chain began.)
- Context (Context is necessary to build a logical chain)
```java

public class Qwerty {
  private void addNote() {
    boolean isEmptyTitle = true;
    if (isEmptyTitle) { 
        this.a0QQAddNoteQQIsEmptyTitle(); 
        return; 
    }
    boolean isBodyTooLong = true;
    if (isBodyTooLong) { 
        this.a1QQAddNoteQQIsBodyTooLong();
        return;
    }
  }

  private void a0QQAddNoteQQIsEmptyTitle() {
    boolean isEmptyTitle = true;
    if (isEmptyTitle) { 
        this.a0a0QQAddNoteQQIsEmptyTitle(); 
        return; 
    }
    boolean isBodyTooLong = true;
    if (isBodyTooLong) { 
        this.a0a1QQAddNoteQQIsBodyTooLong();
        return;
    }
  }

  private void a1QQAddNoteQQIsBodyTooLong() {
    boolean isEmptyTitle = true;
    if (isEmptyTitle) { 
        this.a1a0QQAddNoteQQIsEmptyTitle(); 
        return; 
    }
    boolean isBodyTooLong = true;
    if (isBodyTooLong) { 
        this.a1a1QQAddNoteQQIsBodyTooLong();
        return;
    }
  }

  private void a0a0QQAddNoteQQIsEmptyTitle() {}
  private void a0a1QQAddNoteQQIsBodyTooLong() {}

  private void a1a0QQAddNoteQQIsEmptyTitle() {}
  private void a1a1QQAddNoteQQIsBodyTooLong() {}
}

```