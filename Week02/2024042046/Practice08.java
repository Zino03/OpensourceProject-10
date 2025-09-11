import java.util.Scanner;

public class Practice08 { // SuccessOrFail
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("점수를 입력하시요: ");
        int score = scanner.nextInt();
        if(score >= 80)
            System.out.println("축하합니다! 합격입니다.");

        scanner.close();
    }
}
