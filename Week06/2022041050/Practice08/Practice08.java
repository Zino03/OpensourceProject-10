package Practice08;

interface PhoneInterface { // 인터페이스선언
    final int TIMEOUT = 10000; // 상수필드선언

    void sendCall(); // 추상메소드

    void receiveCall(); // 추상메소드

    default void printLogo() { // default 메소드
        System.out.println("** Phone **");
    }
}

class SamsungPhone implements PhoneInterface { // 인터페이스구현
    // PhoneInterface의모든추상메소드구현

    @Override
    public void sendCall() {
        System.out.println("띠리리리링");
    }

    @Override
    public void receiveCall() {
        System.out.println("전화가왔습니다.");
    }

    // 메소드추가작성
    public void flash() {
        System.out.println("전화기에불이켜졌습니다.");
    }
}

public class Practice08 {
    public static void main(String[] args) {
        SamsungPhone phone = new SamsungPhone();
        phone.printLogo();
        phone.sendCall();
        phone.receiveCall();
        phone.flash();
    }
}