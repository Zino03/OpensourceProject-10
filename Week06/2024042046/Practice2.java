class Person1 { // default : same package
    private int weight;
    int age;
    protected int height;
    public String name;

    public void setWeight(int weight) {
        this.weight = weight;
    }
    public int getWeight() {
        return weight;
    }
}

class Student1 extends Person1 {
    public void set() {
        age = 30;
        name = "홍길동";
        height = 175;
//        weight = 99;
        setWeight(99);
    }
}



public class Practice2 { // InheritanceEx
    public static void main(String[] args) {
        Student1 s = new Student1();
        s.set();
    }
}
