import java.util.Scanner;

public class Practice2 { // Rectangle
    int width;
    int height;
    public int getArea() {
        return width*height;
    }

    public static void main(String[] args) {
        Practice2 rect = new Practice2();
        Scanner scanner = new Scanner(System.in);
        System.out.print(">> ");
        rect.width = scanner.nextInt();
        rect.height = scanner.nextInt();
        System.out.println("사각형의 면적은 "+rect.getArea());
        scanner.close();
    }
}
