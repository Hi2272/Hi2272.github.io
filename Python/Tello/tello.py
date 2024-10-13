from time import sleep
import tellopy


def handler(event, sender, data, **args):
    drone = sender
    if event is drone.EVENT_FLIGHT_DATA:
        print(data)


def test():
    drone = tellopy.Tello()
    try:
        drone.subscribe(drone.EVENT_FLIGHT_DATA, handler)

        drone.connect()
        drone.wait_for_connection(20.0)
        sleep(3)
        drone.takeoff()
        sleep(3)
        drone.clockwise(90)
        sleep(3)        
        drone.land()
        sleep(3)
    except Exception as ex:
        print(ex)
    finally:
        drone.quit()

if __name__ == '__main__':
    test()