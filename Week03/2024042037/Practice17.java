import java.util.Random;
import java.util.Scanner;

public class Practice17 {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Random rd = new Random();

        int random_num = rd.nextInt(99);
        System.out.println("수를 결정하였습니다. 맞추어 보세요.");
        System.out.println("0-99");

        int low = 0;
        int high = 99;
        int cnt = 0;
        while(true){
            cnt++;
            System.out.print(cnt + ">>");
            int n =  sc.nextInt();

            if (n == random_num) {
                System.out.println("맞았습니다.");
                System.out.print("다시하시겠습니까(y/n)>>");
                String text = sc.next();

                if (text.equals("n")) {
                    break;
                }

                random_num = rd.nextInt(99);
                System.out.println("수를 결정하였습니다. 맞추어 보세요.");
                System.out.println("0-99");

                low = 0;
                high = 99;
                cnt = 0;
            } else if (n > random_num) {
                high = n;
                System.out.println("더 낮게");
                System.out.println(low + "-" + high);
            } else {
                low = n;
                System.out.println("더 높게");
                System.out.println(low + "-" + high);
            }
        }

        sc.close();
    }
}
