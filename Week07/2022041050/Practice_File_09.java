import java.util.*;
import java.io.*;

class Words {
    private Vector<String> wordVector;
    public Words(String fileName) {
        wordVector = new Vector<String>();
        
        try (Scanner scanner = new Scanner(new FileReader(fileName))) {
            while (scanner.hasNext()) {
                String word = scanner.nextLine();
                wordVector.add(word); 
            }
        } catch (FileNotFoundException e) {
            System.out.println(fileName + " 파일을 찾을 수 없습니다. (경로 확인 필요)");
        }
    }

    public String getRandomWord() {
        if (wordVector.isEmpty()) {
            return null;
        }
        
        Random random = new Random();
        int index = random.nextInt(wordVector.size());
        return wordVector.get(index);
    }
}

public class Practice_File_09 {
    
    private Words words;       
    private String newWord;
    private StringBuffer hiddenWord; 
    private Scanner scanner; 
    private int failCount;   

    public Practice_File_09() {
        words = new Words("words.txt");
        scanner = new Scanner(System.in);
    }

    public void run() {
        System.out.println("지금부터 행맨 게임을 시작합니다.");

        while (true) {
            newWord = words.getRandomWord();
            if (newWord == null) {
                System.out.println("단어 로드에 실패하여 게임을 종료합니다.");
                break;
            }

            makeHidden();
            go();

            System.out.print("Next(y/n)?");
            String answer = scanner.next();
            if (answer.equalsIgnoreCase("n")) {
                break;
            }
        }
        
        System.out.println("행맨 게임을 종료합니다.");
        scanner.close();
    }

    private void makeHidden() {
        hiddenWord = new StringBuffer(newWord);
        Random random = new Random();
        
        int index1 = random.nextInt(newWord.length());
        int index2;
        do {
            index2 = random.nextInt(newWord.length());
        } while (index1 == index2);

        hiddenWord.setCharAt(index1, '-');
        hiddenWord.setCharAt(index2, '-');
    }

    private void go() {
        failCount = 0; 
        while (true) {
            System.out.println(hiddenWord);
            System.out.print(">>");
            String keyStr = scanner.next();
            
            if (keyStr.isEmpty()) {
                continue;
            }
            char key = keyStr.charAt(0);

            boolean success = complete(key);
            if (hiddenWord.toString().equals(newWord)) {
                System.out.println(newWord); 
                break; 
            }

            if (!success && newWord.indexOf(key) == -1) {
                failCount++;
                if (failCount == 5) {
                    System.out.println("5번 실패 하였습니다.");
                    System.out.println(newWord);
                    break;
                }
            }
        }
    }

    private boolean complete(char key) {
        boolean found = false;
        for (int i = 0; i < newWord.length(); i++) {
            if (newWord.charAt(i) == key && hiddenWord.charAt(i) == '-') {
                hiddenWord.setCharAt(i, key);
                found = true;
            }
        }
        return found;
    }

    public static void main(String[] args) {
        Practice_File_09 game = new Practice_File_09();
        game.run();
    }
}