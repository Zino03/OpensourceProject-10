package project14;
import java.util.Scanner;

public class DivideByZero{
	public static void main(String[] args) {
		Scanner scanner= new Scanner(System.in);
		int dividend;
		int divisor;
		System.out.print("나뉨수를입력하시오:"); 
		dividend = scanner.nextInt();
		System.out.print("나눗수를입력하시오:"); 
		divisor = scanner.nextInt();
		System.out.println(dividend+"를"+ divisor + "로나누면몫은" + 
		dividend/divisor + "입니다.");
		scanner.close();
		}
	}
