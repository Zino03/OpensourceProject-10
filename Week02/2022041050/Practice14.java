import java.util.Scanner;

public class Game {
    public static void main(String[] args) {
        Scanner hand = new Scanner(System.in);
        System.out.println("가위바위보 게임입니다. 가위, 바위, 보 중에서 입력하세요.");

        System.out.print("철수 >> ");
        String first = hand.next();

        System.out.print("영희 >> ");
        String second = hand.next();

        if (first.equals(second)) {
            System.out.println("비겼습니다.");
        } else {
            switch (first) {
                case "가위":
                    if (second.equals("바위")) {
                        System.out.println("영희가 이겼습니다.");
                    } else {
                        System.out.println("철수가 이겼습니다.");
                    }
                    break;
                case "바위":
                    if (second.equals("보")) {
                        System.out.println("영희가 이겼습니다.");
                    } else {
                        System.out.println("철수가 이겼습니다.");
                    }
                    break;
                case "보":
                    if (second.equals("가위")) {
                        System.out.println("영희가 이겼습니다.");
                    } else {
                        System.out.println("철수가 이겼습니다.");
                    }
                    break;
                default:
                    break;
            }
        }
        hand.close();
    }
}