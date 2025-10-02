import java.util.Scanner;

public class Practice02 {
    int width;
    int height;

    public int getArea() {
        return width * height;
    }

    public static void main(String[] args) {
        Practice02 rect = new Practice02();
        Scanner scanner = new Scanner(System.in);
        System.out.print(">> ");
        rect.width = scanner.nextInt();
        rect.height = scanner.nextInt();
        System.out.println("사각형의 면적은" + rect.getArea());
        scanner.close();
    }
}
