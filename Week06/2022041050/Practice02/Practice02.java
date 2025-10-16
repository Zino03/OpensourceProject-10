package Practice02;

class Student extends Person {
    public void set() {
        age = 30;
        name = "홍길동";
        height = 175;
        setWeight(99);
    }
}

public class Practice02 {
    public static void main(String[] args) {
        Student s = new Student();
        s.set();
    }
}
