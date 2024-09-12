import json, os

current_module_dir = os.path.dirname(os.path.abspath(__file__))

with open(f"{current_module_dir}/units.json", "r") as f:
    unit_groups_dict = json.load(f)

from typing import List


# Define the UnitGroup class using Pydantic or similar if necessary, or keep it simple.
class Coords:
    def __init__(self, lat: float, lng: float):
        self.lat = lat
        self.lng = lng


class Details:
    def __init__(self, code: str, name: str, coords: Coords, fuel_type: str):
        self.code = code
        self.name = name
        self.coords = coords
        self.fuel_type = fuel_type


class Unit:
    def __init__(self, unit: str):
        self.unit = unit


class UnitGroup:
    def __init__(self, details: Details, units: List[Unit]):
        self.details = details
        self.units = units


UNIT_GROUPS = [
    UnitGroup(
        details=Details(
            code=ug["details"]["code"],
            name=ug["details"]["name"],
            coords=Coords(**ug["details"]["coords"]),
            fuel_type=ug["details"]["fuel_type"],
        ),
        units=[Unit(**unit) for unit in ug["units"]],
    )
    for ug in unit_groups_dict
]


def get_units_dict():
    unit_group_code = {}
    for unit_group in UNIT_GROUPS:
        for unit in unit_group.units:
            unit_group_code[unit.unit] = unit_group.details.code
    return unit_group_code


def get_unitgroup_fueltype_dict():
    return {
        unit_group.details.code: unit_group.details.fuel_type
        for unit_group in UNIT_GROUPS
    }


def get_unitgroup_coords_dict():
    return {
        unit_group.details.code: (
            unit_group.details.coords.lat,
            unit_group.details.coords.lng,
        )
        for unit_group in UNIT_GROUPS
    }


def get_unitgroup_names_dict():
    return {
        unit_group.details.code: unit_group.details.name for unit_group in UNIT_GROUPS
    }


# lookups
UNIT_UNITGROUP = get_units_dict()
UNITGROUP_COORDS = get_unitgroup_coords_dict()
UNITGROUP_NAMES = get_unitgroup_names_dict()
# UNITGROUP_CODES = {unit_group.details.code for unit_group in UNIT_GROUPS}


UNITGROUP_FUELTYPE = get_unitgroup_fueltype_dict()
