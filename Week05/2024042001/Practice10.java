
class Sample {
    public int a;
    private int b; //b를 private로 선언
    int c;
}

public class practice10 { //AccessEx
    public static void main(String[] args) {
        Sample aClass = new Sample();
        aClass.a = 10;
        aClass.b = 10;
        aClass.c = 10;
    }
}
// private는 sample 클래스 내부에서만 접근 가능한데, 
//b를 private로 선언하면 class AccessEx에서 접근 불가하므로 
//b를 private가 아닌 public으로 받아야한다