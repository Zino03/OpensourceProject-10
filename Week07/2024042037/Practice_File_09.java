import java.util.*;
import java.io.*;

public class Practice_File_09 { // HangManGameApp
    private String hidden;
    private String answer;
    private int wrongCnt;

    public void run() {
        System.out.println("지금부터 행맨 게임을 시작합니다.");
        Words words = new Words("src/words.txt");

        while (true) {
            answer = words.getRandomWord();
            hidden = answer;
            makeHidden();

            if (!go()) break;
        }
    }

    private void makeHidden() {
        for (int i = 0; i < 2; i++) {
            int idx = (int) (Math.random() * answer.length());
            while(hidden.charAt(idx) == '-') {
                idx = (int) (Math.random() * answer.length());
            }
            hidden = hidden.substring(0, idx) + "-" + hidden.substring(idx+1);
        }
    }

    private boolean go() {
        Scanner sc = new Scanner(System.in);
        wrongCnt = 0;
        while (true) {
            if (answer.equals(hidden)) break;
            if (wrongCnt >= 5) {
                System.out.println("총 5번 실패 하였습니다.");
                break;
            }

            System.out.println(hidden);
            System.out.print(">>");
            String input = sc.next();
            char key = input.charAt(0);
            if (complete(key)) {
                int idx = answer.indexOf(key);
                hidden = hidden.substring(0, idx) + key + hidden.substring(idx + 1);
            } else {
                wrongCnt++;
            }
        }
        System.out.println(answer);
        System.out.print("Next(y/n)?");
        if (sc.next().charAt(0) == 'y') {
            return true;
        }
        return false;
    }

    private boolean complete(char key) {
        for (int i = 0; i < answer.length(); i++) {
            if (hidden.charAt(i) == '-' && key == answer.charAt(i)) {
                return true;
            }
        }
        return false;
    }

    public static void main(String [] args) {
        new Practice_File_09().run();
    }
}

class Words{
    Vector<String> wordVector = new Vector<String>();

    public Words(String fileName) {
        try {
            Scanner sc = new Scanner(new FileReader(fileName));
            while (sc.hasNext()) {
                String word = sc.nextLine();
                wordVector.add(word);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }
    public String getRandomWord() {
        int idx = (int) (Math.random() * wordVector.size());
        return wordVector.get(idx);
    }
}
