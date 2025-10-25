import java.io.*;
import java.util.*;

public class Practice_File_04{
    public static void main(String[] args) {
        Scanner scanner= new Scanner(System.in);
        FileWriter fout= null;
        try {
            fout = new FileWriter("test.txt");
            while(true) {
                String line = scanner.nextLine();
                if(line.length() == 0)
                break;
                fout.write(line, 0, line.length());
                fout.write("\r\n", 0, 2);
            }
            fout.close();
        } catch (IOException e) {
            System.out.println("입출력오류");
        }
        scanner.close();
    }
}