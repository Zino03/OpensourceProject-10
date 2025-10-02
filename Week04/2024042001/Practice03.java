
public class practice03{
    int radius;
    String name;

    public practice03() {
        radius = 1;
        name = "";
    }

    public practice03(int r, String n) {
        radius = r;
        name = n;
    }

    public double getArea() {
        return 3.14 * radius * radius;
    }

    public static void main(String[] args) {
        practice03 pizza = new practice03(10, "자바피자");
        double area = pizza.getArea();
        System.out.println(pizza.name + "의 면적은 " + area);

        practice03 donut = new practice03();
        donut.name = "도넛피자";
        area = donut.getArea();
        System.out.println(donut.name + "의 면적은 " + area);
    }
}

