import java.util.Scanner;

public class Practice14 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String cheol, young;

        System.out.println("가위바위보 게임입니다. 가위, 바위, 보 중에서 입력하세요.");
        System.out.print("철수 >> ");
        cheol = scanner.next();
        System.out.print("영희 >> ");
        young = scanner.next();

        int su, hee;
        switch(cheol) {
            case "가위":
                su = 0;
                break;
            case "바위":
                su = 1;
                break;
            default:
                su = 2;
        }
        switch(young) {
            case "가위":
                hee = 0;
                break;
            case "바위":
                hee = 1;
                break;
            default:
                hee = 2;
        }

        if (su == hee)
            System.out.println("비겼습니다.");
        else if ((su == 0 && hee == 2) || (su == 1 && hee == 0) || (su == 2 && hee == 1))
            System.out.println("철수가 이겼습니다.");
        else
            System.out.println("영희가 이겼습니다.");

        scanner.close();
    }
}
