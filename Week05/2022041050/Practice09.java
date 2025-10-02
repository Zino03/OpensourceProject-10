public class Practice09 {
    public static void main(String[] args) {
        String a = new String("Good");
        String b = new String("Bad");
        String c = new String("Normal");
        String d, e;
        a = null; // a가 null 할당 받으면서 'Good' 객체를 가리키는 변수가 없기 때문에 가비지 발생
        d = c;
        c = null;
    }
}