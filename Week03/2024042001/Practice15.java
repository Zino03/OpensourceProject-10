package project15;
import java.util.Scanner;

public class DevideByZeroHandling{
	public static void main(String[] args) {
		Scanner scanner= new Scanner(System.in);
		while(true) {
			System.out.print("나뉨수를입력하시오:"); 
			int dividend = scanner.nextInt();
			System.out.print("나눗수를입력하시오:"); 
			int divisor = scanner.nextInt();
			try {
				System.out.println(dividend + "를"+ divisor + "로나누면몫은" + dividend/divisor + "입니다.");
				break;
				}
			catch(ArithmeticException e) {
				System.out.println("0으로나눌수없습니다. 다시입력하세요");
				}
			}
		scanner.close();
		}
	}