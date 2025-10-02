class Sample {
    public int a;
    private int b;
    int c;
}

public class Practice10 { // AccessEx
    public static void main(String[] args) {
        Sample aClass = new Sample();
        aClass.a = 10;
//        aClass.b = 10; // private 멤버는 선언된 클래스에서만 접근 가능
        aClass.c = 20;
    }
}
