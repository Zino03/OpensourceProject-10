public class Practice9 { // GarbageEx
    public static void main(String[] args) {
        String a = new String("Good");
        String b = new String("Bad");
        String c = new String("Normal");
        String d, e;
        a = null; // a가 null을 할당 받으면서 "Good"객체는 어떤 변수도 잠조하지 않은 가비지가 됨
        d = c;
        c = null;
    }
}
