public class Practice1 { // Circle
    int radius;
    String name;
    public Practice1() {}
    public double getArea() {
        return 3.14 * radius * radius;
    }

    public static void main(String[] args) {
        Practice1 pizza;
        pizza = new Practice1();
        pizza.radius = 10;
        pizza.name = "자바피자";
        double area = pizza.getArea();
        System.out.println(pizza.name+"의 면적은 "+area);

        Practice1 donut = new Practice1();
        donut.radius = 2;
        donut.name="자바도넛";
        area = donut.getArea();
        System.out.println(donut.name+"의 면적은 "+area);
    }
}
