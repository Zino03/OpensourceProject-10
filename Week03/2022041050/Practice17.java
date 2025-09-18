import java.util.Scanner;

public class Practice17 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String play = "y";
        do {
            int value = (int) (Math.random() * 100);
            System.out.println("수를 결정하였습니다. 맞추어 보세요.");
            int min = 0;
            int max = 99;
            int count = 1;
            while (true) {
                System.out.println(min + " ~ " + max);
                System.out.print(count + ">> ");
                int answer = scanner.nextInt();
                if (answer == value) {
                    System.out.println("맞았습니다");
                    break;
                } else if (answer > value) {
                    System.out.println("더 낮게");
                    max = answer;
                } else if (answer < value) {
                    System.out.println("더 높게");
                    min = answer;
                }
                count++;
            }
            System.out.print("다시하시겠습니까?(y/n)>> ");
            play = scanner.next();
        } while (play.equals("y"));
        scanner.close();
    }
}
