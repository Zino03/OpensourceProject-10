class Sample {
    public int a;
    private int b;
    int c;
}

public class Practice10 {   // AccessEx
    public static void main(String [] args) {
        Sample aClass = new Sample();
        aClass.a = 10;
        aClass.b = 10;  // 오류 발생
        // Sample 클래스의 변수 b는 private 변수이므로 Sample 클래스 내에서만 접근 가능함
        // Sample 클래스의 외부인 이곳에서 변수 b에 접근 -> 컴파일 오류
        aClass.c = 20;
    }
}
