public class Practice09 {   // GarbageEx
    public static void main(String[] args) {
        String a = new String("Good");
        String b = new String("Bad");
        String c = new String("Normal");
        String d, e;
        a = null;   //"Good" 객체를 아무것도 가리키지 않음 -> 가비지 발생
        d = c;
        c = null;
    }
}
