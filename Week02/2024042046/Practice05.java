public class Practice05 { // AssignmentIncDecOperator
    public static void main(String[] args) {
        int a=3, b=3, c=3;

        a+=3;
        b*=3;
        c%=2;
        System.out.println("a=" + a + ", b=" + b + ", c=" + c); // a=6, b=9, c=1

        int d=3;
        a=d++;
        System.out.println("a=" + a + ", d=" + d); // a=3, d=4
        a=++d;
        System.out.println("a=" + a + ", d=" + d); // a=5, d=5
        a=d--;
        System.out.println("a=" + a + ", d=" + d); // a=5, d=4
        a=--d;
        System.out.println("a=" + a + ", d=" + d); // a=3, d=3
    }
}
