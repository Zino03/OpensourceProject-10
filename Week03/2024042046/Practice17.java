import java.util.Scanner;

public class Practice17 {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        while(true) {
            int num = (int)(Math.random()*100);
            System.out.println("수를 결정하였습니다. 맞추어 보세요.");
            System.out.println("0-99");

            int count = 1;
            while(true) {
                System.out.print(count+">>");
                int num2 = scanner.nextInt();

                if(num2 == num) {
                    break;
                } else if(num2 < num) {
                    System.out.println("더 높게");
                } else {
                    System.out.println("더 낮게");
                }

                count++;
            }

            System.out.println("맞았습니다.");

            System.out.print("다시하시겠습니까?(y/n)>>");
            scanner.nextLine(); // 마지막 nextInt의 엔터받기
            String select = scanner.nextLine();

            if(!select.equals("y")) {
                break;
            }
        }
    }
}
