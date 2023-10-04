import base64
from codecs import Codec
from time import sleep
from openstack import connection as connexion

#Constants 
PRIVATE_NETWORK_ID = "0d49c37b-7077-4152-985c-f5a00ad20677"
EXTERNAL_NETWORK_ID = "e64da4e4-57c4-473a-9b4d-548c800b654a"

from time import sleep
from openstack import connection as connexion

#Constants 
PRIVATE_NETWORK_ID = "0d49c37b-7077-4152-985c-f5a00ad20677"
EXTERNAL_NETWORK_ID = "e64da4e4-57c4-473a-9b4d-548c800b654a"

with open("pw.sec", "r") as f:
    pw = f.readlines()
### Connection ; décommenter les deux lignes pour l'utilisateur voulu et ne pas oublier de recommenter les 2 autres
# etudiant1
# password = pw[0]
# conn = connexion.Connection(auth_url="http://172.10.3.60:5000/v3", project_name="etudiant1", username="etudiant1", password=password, user_domain_id="default", project_domain_id="default")
# admin
password = pw[1]
conn = connexion.Connection(auth_url="http://172.10.3.60:5000/v3", project_name="admin", username="admin", password=password, user_domain_id="default", project_domain_id="default")


def get_infos(conn):
    for server in conn.compute.servers():
        print(f"Server name : {server.name}\n")

    for image in conn.compute.images():
        print("Image name : " + image.name)

def get_flavor(conn):
    for flavor in conn.compute.flavors():
        print("Flavor name : " + flavor.name)

def get_network(conn):
    print("--------------------")
    for network in conn.network.networks():
        print("Network name : " + network.name)
        print("Network id : " + network.id)
        print("Network status : " + network.status)
        print("--------------------")

### Admin only
def get_endpoint(conn):
    for endpoint in conn.identity.endpoints():
        print(f"Endpoint name : {endpoint.name}")
def get_projects(conn):
    for project in conn.identity.projects():
        print(f"Project name : {project.name}")
def get_users(conn):
    for user in conn.identity.users():
        print(f"User name : {user.name}")

# def create_instance(conn):
#     image = conn.compute.find_image("debian-12-image")
#     flavor = conn.compute.find_flavor("m1.small")
#     key_pair = conn.compute.find_keypair("etudiant1-MB")
#     floating_ip = conn.network.find_available_ip()
#     server = conn.compute.create_server(
#         name="test",
#         image_id=image.id,
#         flavor_id=flavor.id,
#         networks=[{"uuid": PRIVATE_NETWORK_ID}],
#         key_name=key_pair.name,
#         # encode in base64
#         user_data=base64.b64encode(b"#!/bin/bash\napt update\napt install -y apache2\nsystemctl start apache2\nsystemctl enable apache2\n").decode("utf-8"),
#     )
#     server = conn.compute.wait_for_server(server)
#     print(server.name + " created")
def create_instance(conn, vm_name:str):
    image = conn.compute.find_image("Kali-Template")
    flavor = conn.compute.find_flavor("m1.kali")
    # key_pair = conn.compute.find_keypair("etudiant1-MB")
    userdata = """
    #!/bin/sh
    userdel -rf user
    useradd -m -s /bin/bash hugo
    echo "hugo:azerty" | chpasswd
    echo "root:test" | chpasswd
    systemctl disable ssh
    systemctl stop ssh
    """
    server = conn.compute.create_server(
        name=vm_name,
        image_id=image.id,
        flavor_id=flavor.id,
        networks=[{"uuid": PRIVATE_NETWORK_ID}],
        user_data=base64.b64encode(userdata.encode("utf-8")).decode("utf-8"),
    )
    # server = conn.compute.wait_for_server(server)
    print(server.name + " created")
def remove_instance(conn, name:str):
    server = conn.compute.find_server(name)
    conn.compute.delete_server(server)
    print(server.name + " deleted")

def get_floating_IPs(conn):
    for ip in conn.network.ips():
        print(f"IP name : {ip.name}")

    #create a new floating ip (fonctionne)
    # ip = conn.network.create_ip(floating_network_id=EXTERNAL_NETWORK_ID)

def remove_floating_IP(conn, ip:str):
    conn.network.delete_ip(ip)

def get_console_url(conn):
    server = conn.compute.find_server("test")
    print(server.get_console_url(conn.compute, "novnc"))

# get_flavor(conn)
# get_network(conn)
# get_infos(conn)
# get_endpoint(conn)
# get_projects(conn)
# get_users(conn)
# get_infos(conn)
# get_floating_IPs(conn)
# remove_floating_IP(conn)
# remove_instance(conn)
# create_instance(conn)
# sleep(3)
# remove_instance(conn)
# get_console_url(conn)
for i in range(3):
    create_instance(conn, f"test{i}")
