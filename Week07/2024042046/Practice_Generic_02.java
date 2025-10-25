import java.util.Vector;

class Point4 {
    private int x, y;
    public Point4(int x, int y) {
        this.x = x;
        this.y = y;
    }
    public String toString() {
        return "(" + x + ", " + y + ")";
    }
}

public class Practice_Generic_02 { // PointVectorEx
    public static void main(String[] args) {
        Vector<Point4> v = new Vector<Point4>();
        v.add(new Point4(2,3));
        v.add(new Point4(-5,20));
        v.add(new Point4(30,-8));
        v.remove(1);
        for(int i=0; i<v.size(); i++) {
            Point4 p = v.get(i);
            System.out.println(p);
        }
    }
}
