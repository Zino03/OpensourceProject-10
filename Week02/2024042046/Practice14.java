import java.util.Scanner;

public class Practice14 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // 입력
        System.out.println("가위바위보 게임입니다. 가위, 바위, 보 중에서 입력하세요");
        System.out.print("철수 >> ");
        String input1 = scanner.next();
        System.out.print("영희 >> ");
        String input2 = scanner.next();
        int var = -1; // 승자가 철수면 1, 영희면 2, 비겼을 경우 0, 잘못된 입력은 -1

        // 가위바위보 결과 판별
        if(input1.equals(input2))
            var = 0;
        else {
            if(input1.equals("가위")) {
                if(input2.equals("보")) {
                    var = 1;
                }
                else if(input2.equals("바위")) {
                    var = 2;
                }
            }
            else if(input1.equals("바위")) {
                if(input2.equals("가위")) {
                    var = 1;
                }
                else if(input2.equals("보")) {
                    var = 2;
                }
            }
            else if(input1.equals("보")) {
                if(input2.equals("바위")) {
                    var = 1;
                }
                else if(input2.equals("가위")) {
                    var = 2;
                }
            }
        }

        // 가위바위보 결과 출력
        switch(var) {
            case 0:
                System.out.println("비겼습니다.");
                break;
            case 1:
                System.out.println("철수가 이겼습니다.");
                break;
            case 2:
                System.out.println("영희가 이겼습니다.");
                break;
            default:
                System.out.println("잘못된 입력입니다.");
        }
    }
}
