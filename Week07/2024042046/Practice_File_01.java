import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

public class Practice_File_01 { // FileReaderEx
    public static void main(String[] args) {
        FileReader fin = null;
        try {
            fin = new FileReader("c:\\windows\\system.ini");
            int c;
            while((c=fin.read())!=-1) {
                System.out.print(c);
            }
            fin.close();
        }
        catch(IOException e) {
            System.out.println("입출력오류");
        }
    }
}
