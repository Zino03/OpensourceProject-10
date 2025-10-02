
public class practice09 { //GarbageEx
    public static void main(String[] args) {
        String a = new String("Good");
        String b = new String("Bad");
        String c = new String("Normal");
        String d, e;
        
        a = null; //객체 Good이 더 이상 참조가 없어 가비지가 발생한다.
        d = c;
        c = null;
    }
}
