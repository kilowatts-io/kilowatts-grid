import json
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom

# Define the initial values
user_agent = "*"
disallow = ["/private", "/secret"]
allow = ["/public"]

# Create the initial robots.txt content
robots_txt_content = f"User-agent: {user_agent}\n"
for path in disallow:
    robots_txt_content += f"Disallow: {path}\n"
for path in allow:
    robots_txt_content += f"Allow: {path}\n"

VARIANTS = ['/', '/map']

# List of fuel types to be added as pages
fuel_types = ["gas", "nuclear", "solar", "wind"]

# Create the root element for the sitemap
urlset = Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

# Add rules for each fuel_type page in robots.txt and sitemap
for fuel_type in fuel_types:
    for variant in VARIANTS:
        path = f"/fuel_type/{fuel_type}{variant}"
        robots_txt_content += f"Allow: {path}\n"
        robots_txt_content += f"\nUser-agent: {user_agent}\n"

        # Add the URL to the sitemap
        url = SubElement(urlset, "url")
        loc = SubElement(url, "loc")
        loc.text = f"https://gb.kilowatts.io{path}"

# Path to units.json file
UNITS_FP = 'amplify/python/now/external_apis/bm/units.json'

# Open the units file and add unit pages to robots.txt and sitemap
with open(UNITS_FP, 'r') as f:
    units = json.load(f)
    
for unit in units:
    code = unit['details']['code'].lower()
    for variant in VARIANTS:
        path = f"/unit/{code}{variant}"
        robots_txt_content += f"Allow: {path}\n"
        robots_txt_content += f"\nUser-agent: {user_agent}\n"
        
        # Add the URL to the sitemap
        url = SubElement(urlset, "url")
        loc = SubElement(url, "loc")
        loc.text = f"https://gb.kilowatts.io{path}"

# Add the sitemap URL to the robots.txt file
robots_txt_content += "\nSitemap: https://gb.kilowatts.io/sitemap.xml\n"

# Save the robots.txt file
with open("public/robots.txt", "w") as f:
    f.write(robots_txt_content)

print("robots.txt file generated successfully.")

# Function to prettify the XML output
def prettify(elem):
    """Return a pretty-printed XML string for the Element."""
    rough_string = tostring(elem, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ")

# Generate the sitemap.xml content
sitemap_content = prettify(urlset)

# Save the sitemap.xml file
with open("public/sitemap.xml", "w") as f:
    f.write(sitemap_content)

print("sitemap.xml file generated successfully.")