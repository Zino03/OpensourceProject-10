import java.util.InputMismatchException;
import java.util.Scanner;
import java.util.Vector;
import java.util.Random;

class Word {
    private String english;
    private String korean;

    public Word(String english, String korean) {
        this.english = english;
        this.korean = korean;
    }

    public String getEnglish() {
        return english;
    }

    public String getKorean() {
        return korean;
    }
}

public class Practice_Generic_09 {
    private String name;
    private Vector<Word> v;
    private Scanner scanner;
    private Random random;

    public Practice_Generic_09(String name) {
        this.name = name;
        this.v = new Vector<Word>();
        this.scanner = new Scanner(System.in);
        this.random = new Random();

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

    private boolean exists(int n[], int index) {
        for (int i = 0; i < n.length; i++) {
            if (n[i] == index) {
                return true;
            }
        }
        return false;
    }

    private int makeExample(int ex[], int answerIndex) {
        for (int i = 0; i < ex.length; i++) {
            ex[i] = -1;
        }

        int answerPos = random.nextInt(4);
        ex[answerPos] = answerIndex; 

        for (int i = 0; i < 4; i++) {
            if (i == answerPos) {
                continue; 
            }
            int wrongIndex;
            do {
                wrongIndex = random.nextInt(v.size());
            } while (wrongIndex == answerIndex || exists(ex, wrongIndex));
            
            ex[i] = wrongIndex;
        }
        return answerPos + 1;
    }

    public void run() {
        System.out.println("\"" + this.name + "\"의 단어 테스트를 시작합니다. -1을 입력하면 종료합니다.");
        System.out.println("현재 " + v.size() + "개의 단어가 들어 있습니다.");

        while (true) {
            int answerIndex = random.nextInt(v.size());
            Word answerWord = v.get(answerIndex);
            String question = answerWord.getEnglish();

            int[] ex = new int[4];
            int answerChoice = makeExample(ex, answerIndex);

            System.out.print(question + "?\n");

            for (int i = 0; i < ex.length; i++) {
                String koreanMean = v.get(ex[i]).getKorean();
                System.out.print("(" + (i + 1) + ")" + koreanMean + " ");
            }
            
            System.out.print(" :> ");

            try {
                int userChoice = scanner.nextInt();

                if (userChoice == -1) {
                    System.out.println("\n\"" + this.name + "\"를 종료합니다...");
                    break;
                }

                if (userChoice == answerChoice) {
                    System.out.println("Excellent !!");
                } else if (userChoice >= 1 && userChoice <= 4) {
                    System.out.println("No. !!");
                } else {
                    System.out.println("잘못된 입력입니다. 1~4 사이의 숫자나 -1을 입력하세요.");
                }

            } catch (InputMismatchException e) {
                System.out.println("오류: 숫자를 입력해야 합니다. 다시 시도하세요.");
                scanner.next(); 
            }
            System.out.println(); 
        } 
        scanner.close(); 
    }

    public static void main(String[] args) {
        Practice_Generic_09 quiz = new Practice_Generic_09("명품영어");
        quiz.run();
    }
}