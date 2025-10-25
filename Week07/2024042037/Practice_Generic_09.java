import java.util.InputMismatchException;
import java.util.Random;
import java.util.Scanner;
import java.util.Vector;
class Word {
    private String en, ko;
    public Word(String en, String ko) {
        this.en = en;
        this.ko = ko;
    }

    public String getEn() {
        return en;
    }
    public String getKo() {
        return ko;
    }
}
public class Practice_Generic_09{   // WordQuiz
    private String name;
    private Vector<Word> v;
    private Scanner scanner = new Scanner(System.in);

    public Practice_Generic_09(String name) {
        this.name = name;
        v = new Vector<Word>();
        v.add(new Word("love", "사랑"));
        v.add(new Word("animal", "동물"));
        v.add(new Word("emotion", "감정"));
        v.add(new Word("human", "인간"));
        v.add(new Word("stock", "주식"));
        v.add(new Word("trade", "거래"));
        v.add(new Word("society", "사회"));
        v.add(new Word("baby", "아기"));
        v.add(new Word("honey", "꿀"));
        v.add(new Word("dall", "인형"));
        v.add(new Word("bear", "곰"));
        v.add(new Word("picture", "사진"));
        v.add(new Word("painting", "그림"));
        v.add(new Word("fault", "오류"));
        v.add(new Word("example", "보기"));
        v.add(new Word("eye", "눈"));
        v.add(new Word("statue", "조각상"));
    }
    private int[] makeExample(int ex[], int answerIndex) {
        int idx = new Random().nextInt(4);
        ex[idx] = answerIndex;

        for (int i = 0; i < ex.length; i++) {
            if (ex[i] == -1) {
                idx = new Random().nextInt(v.size());
                while (exists(ex, idx)) {
                    idx = new Random().nextInt(v.size());
                }
                ex[i] = idx;
            }
        }

        return ex;
    }
    private boolean exists(int n[], int index) {
        for (int i = 0; i < n.length; i++) {
            if (n[i] == index) {
                return true;
            }
        }
        return false;
    }
    public void run() {
        System.out.println("\"" + name + "\"의 단어 테스트를 시작합니다. -1을 입력하면 종료합니다.");
        System.out.println("현재 " + v.size() + "개의 단어가 들어있습니다.");

        while (true) {
            int answerIndex = new Random().nextInt(v.size());
            int [] ex = {-1, -1, -1, -1};
            ex = makeExample(ex, answerIndex);

            System.out.println(v.get(answerIndex).getEn() + "?");
            for (int i = 0; i < ex.length; i++) {
                System.out.print("(" + (i+1) + ")" + v.get(ex[i]).getKo() + " ");
            }
            System.out.print(":>");

            int choice = scanner.nextInt();

            if (choice == -1){
                scanner.close();
                System.out.println("\"" + name + "\"" + "를 종료합니다...");
                break;
            }

            if (ex[choice-1] == answerIndex) {
                System.out.println("Excellent !!");
            } else {
                System.out.println("No. !!");
            }
        }
    }
    public static void main(String[] args) {
        new Practice_Generic_09("명품영어").run();
    }
}
