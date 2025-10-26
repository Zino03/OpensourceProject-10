import java.util.Scanner;
import java.util.Vector;

class Word {
    private String eng, kor;
    public Word(String eng, String kor) {
        this.eng = eng;
        this.kor = kor;
    }
    public String getEng() {
        return eng;
    }
    public String getKor() {
        return kor;
    }
}

public class Practice_Generic_09 { // WordQuiz
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
        int random = (int) (Math.random()*4);
        ex[random] = answerIndex;

        for(int n = 0; n<4; n++) {
            if(n != random) {
                int index;
                do {
                    index = (int) (Math.random()*v.size());
                } while(exists(ex, index));
                ex[n] = index;
            }
        }

        return ex;
    }

    private boolean exists(int n[], int index) {
        for(int i=0; i<n.length; i++) {
            if(n[i] == index) {
                return true;
            }
        }
        return false;
    }

    public void run() {
        System.out.println("\""+name+"\"의 단어 테스트를 시작합니다. -1을 입력하면 종료합니다.");
        System.out.println("현재 "+v.size()+"개의 단어가 들어 있습니다.");

        while(true) {
            int answerIndex = (int) (Math.random()*v.size());
            System.out.println(v.get(answerIndex).getEng()+"?");

            int ex[] = new int[] {-1,-1,-1,-1};
            ex = makeExample(ex,answerIndex);
            for(int n = 0; n<4; n++) {
                System.out.print("("+(n+1)+")"+v.get(ex[n]).getKor()+" ");
            }
            System.out.print("::>");

            int input = scanner.nextInt();

            if(input == -1) {
                System.out.println("\""+name+"\"를 종료합니다...");
                break;
            }

            if(answerIndex == ex[input-1]) {
                System.out.println("Excellent !!");
            } else {
                System.out.println("No !!");
            }
        }
    }

    public static void main(String[] args) {
        new Practice_Generic_09("명품영어").run();
    }
}