import java.io.*;
import java.util.Scanner;
import java.util.Vector;

public class Practice_File_09 { // HangManGameApp
    private String hiddenWord;
    private String word;
    Words words;

    Practice_File_09(){
        words = new Words("C:\\Users\\jademon\\Downloads\\words.txt");
    }

    public void run() {
        System.out.println("지금부터 행맨 게임을 시작합니다.");
        go();
    }

    private void makeHidden() {
        word = words.getRandomWord();
        int index = (int) (Math.random()*word.length());
        hiddenWord = word.substring(0, index)+"-"+word.substring(index+1);

        do {
            index = (int) (Math.random()*word.length());
        } while(hiddenWord.charAt(index)=='-');
        hiddenWord = hiddenWord.substring(0, index)+"-"+hiddenWord.substring(index+1);
    }

    private void go() {
        Scanner scanner = new Scanner(System.in);
        while(true) {
            makeHidden();
            for(int i=0; i<5; i++) {
                System.out.println(hiddenWord);
                System.out.print(">>");
                String input = scanner.next();

                int index = hiddenWord.indexOf('-');
                if(complete(input.charAt(0))) {
                    hiddenWord = hiddenWord.substring(0, index)+input+hiddenWord.substring(index+1);
                }

                index = hiddenWord.indexOf('-');
                if(index==-1) {
                    break;
                }

                if(i==4) {
                    System.out.println("5번 실패 하였습니다.");
                }
            }
            System.out.println(word);
            System.out.print("Next(y/n)?");
            String input = scanner.next();
            if(input.equals("n") || input.equals("N")) break;
        }
    }

    private boolean complete(char key) {
        int index = hiddenWord.indexOf('-');
        if(key == word.charAt(index)) {
            return true;
        }
        return false;
    }

    public static void main(String[] args) {
        new Practice_File_09().run();
    }
}

class Words {
    Vector<String> wordVector;

    public Words(String fileName) {
        wordVector = new Vector<String>();
        try {
            Scanner scanner = new Scanner(new File(fileName));
            while(scanner.hasNext()) {
                String word = scanner.nextLine();
                wordVector.add(word);
            }
        } catch(IOException e) {
            e.printStackTrace();
        }
    }

    public String getRandomWord() {
        int randomIndex = (int)(Math.random() * wordVector.size());
        return wordVector.get(randomIndex);
    }
}