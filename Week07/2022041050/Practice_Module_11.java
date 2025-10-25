import java.util.Scanner;

public class Practice_Module_11{
    private int[] alphaCounts;
    public Practice_Module_11() {
        alphaCounts = new int[26];
    }

    public void run() {
        System.out.println("영문 텍스트를 입력하고 세미콜론을 입력하세요.");
        String text = readString();
        makeHistogram(text);
        drawHistogram();
    }

    private void makeHistogram(String text) {
        text = text.toUpperCase();

        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c >= 'A' && c <= 'Z') {
                int index = c - 'A';
                alphaCounts[index]++;
            }
        }
    }

    private void drawHistogram() {
        System.out.println("\n히스토그램을 그립니다.\n");

        for (int i = 0; i < alphaCounts.length; i++) {
            char letter = (char) ('A' + i);
            int count = alphaCounts[i];
            System.out.print(letter + ":");

            for (int j = 0; j < count; j++) {
                System.out.print('-');
            }
            System.out.println();
        }
    }

    private String readString() {
        StringBuffer sb = new StringBuffer(); 
        Scanner scanner = new Scanner(System.in);
        while (true) {
            String line = scanner.nextLine(); 
            if (line.equals(";")) {
                break;
            }
            sb.append(line);
        }
        scanner.close();
        return sb.toString();
    }

    public static void main(String[] args) {
        Practice_Module_11 app = new Practice_Module_11();
        app.run();
    }
}