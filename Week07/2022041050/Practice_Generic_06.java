import java.util.*;

public class Practice_Generic_06{
    public static void main(String[] args) {
        HashMap<String, Integer> javaScore= new HashMap<String, Integer>();
        javaScore.put("김성동", 97);
        javaScore.put("황기태", 88);
        javaScore.put("김남윤", 98);
        javaScore.put("이재문", 70);
        javaScore.put("한원선", 99);
        System.out.println("HashMap의요소개수:" + javaScore.size());
        Set<String> keys = javaScore.keySet();
        Iterator<String> it = keys.iterator();
        while(it.hasNext()) {
            String name = it.next();
            int score = javaScore.get(name);
            System.out.println(name + " : " + score);
        }
    }
}