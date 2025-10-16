package Practice09;

interface PhoneInterface { // 인터페이스선언
    final int TIMEOUT = 10000; // 상수필드선언

    void sendCall(); // 추상메소드

    void receiveCall(); // 추상메소드

    default void printLogo() { // default 메소드
        System.out.println("** Phone **");
    }
}

interface MobilePhoneInterface extends PhoneInterface {

    void sendSMS();

    void receiveSMS();
}

interface MP3Interface { // 인터페이스선언
    public void play();

    public void stop();
}

class PDA { // 클래스작성
    public int calculate(int x, int y) {
        return x + y;
    }
}

class SmartPhone extends PDA implements MobilePhoneInterface, MP3Interface {
    // MobilePhoneInterface의추상메소드구현
    @Override
    public void sendCall() {
        System.out.println("따르릉따르릉~~");
    }

    @Override
    public void receiveCall() {
        System.out.println("전화왔어요.");
    }

    @Override
    public void sendSMS() {
        System.out.println("문자갑니다.");
    }

    @Override
    public void receiveSMS() {
        System.out.println("문자왔어요.");
    }

    // MP3Interface의추상메소드구현
    @Override
    public void play() {
        System.out.println("음악연주합니다.");
    }

    @Override
    public void stop() {
        System.out.println("음악중단합니다.");
    }

    // 추가로작성한메소드
    public void schedule() {
        System.out.println("일정관리합니다.");
    }
}

public class Practice09 {
    public static void main(String[] args) {
        SmartPhone phone = new SmartPhone();
        phone.printLogo();
        phone.sendCall();
        phone.play();
        System.out.println("3과5를더하면" +
                phone.calculate(3, 5));
        phone.schedule();
    }

}
