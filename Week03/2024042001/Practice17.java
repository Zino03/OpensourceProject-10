package project17;
import java.util.Scanner;
import java.util.Random;

public class CardCountingGame {
	public static void main (String [] args) {
		Scanner scanner = new Scanner(System.in);
		Random random = new Random();
		
		while (true) {
			System.out.print("수를 결정하였습니다. 맞추어 보세요.\n");
			int answer = random.nextInt(100);
			int min = 0, max = 99;
			int count = 0;
			
			while(true) {
				System.out.print(min + "-" + max + "\n");
				System.out.print(++count + ">>");
				int guess = scanner.nextInt();
				
				if(guess < answer) {
					System.out.print("더 높게\n");
					min = guess;
				}
				else if(guess > answer) {
					System.out.print("더 낮게\n");
					max = guess;
				}
				else {
					System.out.print("맞았습니다.\n");
					break;
				}
			}
			
			System.out.print("다시하시겠습니까(y/n)>>");
			String text = scanner.next ();
			if(text.equals ("n")) {
				break;
				}
			}

		scanner.close();
	}
}