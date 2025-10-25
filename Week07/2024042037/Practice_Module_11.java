import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Scanner;

public class Practice_Module_11 {   // AlphabetHistogramApp
    int[] cnt = new int[26];

    public Practice_Module_11() {}
    public void run() {
        System.out.println("영문 텍스트를 입력하고 세미콜론을 입력하세요.");
        System.out.println();
        String s = readString();
        makeHistogram(s);
        drawHistogram();
    }
    private void makeHistogram(String text) {
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (Character.isAlphabetic(c)) {
                c = Character.toUpperCase(c);
                cnt[c - 'A']++;
            }
        }
    }
    private void drawHistogram() {
        System.out.println("히스토그램을 그립니다.");
        for (int i = 0; i < 26; i++) {
            System.out.print((char) (i + 'A'));
            for (int j = 0; j < cnt[i]; j++) {
                System.out.print("-");
            }
            System.out.println();
        }
    }
    private String readString() {
        StringBuffer sb = new StringBuffer();
        Scanner scanner = new Scanner(System.in);
        while (true) {
            String line = scanner.nextLine();
            if (line.equals(";"))
                break;
            sb.append(line);
        }
        return sb.toString();
    }
    public static void main(String[] args) {
        new Practice_Module_11().run();
    }
}
