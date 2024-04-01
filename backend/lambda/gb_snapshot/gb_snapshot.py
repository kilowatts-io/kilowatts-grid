import logging
from typing import List
from .ng_dist.ng_dist import NationalGridDistributionNetworks
from .s3 import write_summary_output
from .ptypes import (
    BalancingTotals,
    EmbeddedSnapshot,
    ForeignMarketSnapshot,
    NationalGridGspSnapshot,
    SummaryOutput,
    TotalsSnapshot,
)
from .generation import GenerationTotals
from .foreign_markets import ForeignMarketTotals
from .request_params import get_request_params
from .embedded import Embedded
from .bm import Bm


def combine_totals(gen_totals: List[TotalsSnapshot], fm_totals: ForeignMarketSnapshot):
    totals = gen_totals + [fm_totals]
    totals.sort(key=lambda x: x.ac, reverse=True)
    return totals


def combine_gen_unit_groups(
    bm_unit_groups: List[EmbeddedSnapshot], ngdnos: List[NationalGridGspSnapshot]
):
    ngdnos = [n for n in ngdnos if n.ac > 0]
    combined = bm_unit_groups + ngdnos
    # resort by ac, then cp
    combined.sort(key=lambda x: x.ac, reverse=True)
    return combined


def gb_snapshot():
    request_params = get_request_params()
    print(f"preparing for {request_params.dt}...")

    kwargs = request_params.model_dump()
    logging.info(f"getting bm")
    bm = Bm(**kwargs).run()

    embedded = Embedded(**kwargs).run()

    logging.info(f"combining generation totals from bm and embedded")
    gen_unit_groups, gen_totals = GenerationTotals(
        bm=bm.copy(), embedded=embedded
    ).run()
    logging.info(f"getting foreign market totals")
    fms, fm_totals = ForeignMarketTotals(bm=bm.copy()).run()
    logging.info(f"combining totals for generators and foreign markets")
    totals = combine_totals(gen_totals, fm_totals)
    logging.info(f"if possible, adding national grid embeddded to totals")
    ngdnos = NationalGridDistributionNetworks().run()
    if ngdnos is not None:
        gen_unit_groups = combine_gen_unit_groups(gen_unit_groups, ngdnos)
    else:
        logging.info(
            f"no national grid distribution networks response returned, skipping..."
        )
    logging.info(f"writing summary output")

    write_summary_output(
        SummaryOutput(
            dt=request_params.dt,
            totals=totals,
            generators=gen_unit_groups,
            foreign_markets=fms,
            balancing_totals=BalancingTotals(**bm.sum().to_dict()),
        )
    )

    return "Completed!"
