import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.action_chains import ActionChains

URL = "https://www.dsbmobile.de/"
PASSWORD = os.environ.get("DSB_PASSWORD", "HIER_IHR_PASSWORT")


def wait_for_page_load(driver, timeout=20):
    WebDriverWait(driver, timeout).until(
        lambda d: d.execute_script("return document.readyState") == "complete"
    )


def click_if_present(driver, locators, timeout=3):
    """
    Versucht nacheinander mehrere Locator-Varianten und klickt,
    sobald die erste passt. Ignoriert Fehler, wenn nichts gefunden wird.
    locators: Liste aus Tupeln (By, Selector)
    """
    end = time.time() + timeout
    for by, sel in locators:
        remaining = max(0, end - time.time())
        if remaining == 0:
            break
        try:
            el = WebDriverWait(driver, remaining).until(
                EC.element_to_be_clickable((by, sel))
            )
            el.click()
            return True
        except Exception:
            pass
    return False


def click_body(driver):
    try:
        body = driver.find_element(By.TAG_NAME, "body")
        body.click()
    except Exception:
        try:
            ActionChains(driver).move_by_offset(10, 10).click().perform()
        except Exception:
            driver.execute_script(
                "if (document.body && document.body.click) document.body.click();"
            )


def main():
    options = ChromeOptions()
    options.add_argument("--start-maximized")
    # Optional ruhiger:
    # options.add_argument("--disable-notifications")

    driver = webdriver.Chrome(options=options)
    wait = WebDriverWait(driver, 25)

    try:
        driver.get(URL)
        wait_for_page_load(driver, timeout=20)

        # Optional: Cookie-Banner bestätigen (mehrere Heuristiken)
        click_if_present(
            driver,
            locators=[
                (By.CSS_SELECTOR, "button[id*='accept'], button[class*='accept']"),
                (By.XPATH, "//button[contains(., 'Akzeptieren') or contains(., 'Einverstanden') or contains(., 'Alle akzeptieren')]"),
                (By.XPATH, "//div[contains(@class,'cookie')]//button[contains(., 'Akzept')]"),
            ],
            timeout=3,
        )

        # Passwortfeld finden (ggf. anpassen: Name/ID)
        password_input = wait.until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "input[type='password'], input[name*='pass'], input[id*='pass']")
            )
        )
        password_input.click()
        password_input.clear()
        password_input.send_keys(PASSWORD)

        # Login absenden: Submit-Button oder Enter
        submit_buttons = driver.find_elements(By.CSS_SELECTOR, "button[type='submit'], input[type='submit']")
        if submit_buttons:
            wait.until(EC.element_to_be_clickable(submit_buttons[0])).click()
        else:
            password_input.send_keys(Keys.ENTER)

        # Nach Login: auf vollständiges Laden warten
        wait_for_page_load(driver, timeout=25)

        # Optional: Auf ein spezifisches Post-Login-Element warten (anpassen)
        # wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".some-dashboard-selector")))

        # Klick in den Body-Bereich
        click_body(driver)

        time.sleep(1.5)

    except TimeoutException:
        print("Timeout: Ein Element oder die Seite hat zu lange gebraucht.")
        raise
    finally:
        driver.quit()


if __name__ == "__main__":
    main()
