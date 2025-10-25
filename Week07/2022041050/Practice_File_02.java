import java.io.*;

public class Practice_File_02{
    public static void main(String[] args) {
        InputStreamReader in = null;
        FileInputStream fin = null;
        try {
            fin = new FileInputStream("hangul.txt");
            in = new InputStreamReader(fin, "MS949");
            int c;
            System.out.println("인코딩문자집합은" + in.getEncoding());
            while ((c = in.read()) != -1) {
                System.out.print((char)c);
            }
            in.close();
            fin.close();
        } catch (IOException e) {
            System.out.println("입출력오류");
        }
    }
}