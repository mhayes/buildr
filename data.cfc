<cfcomponent output="no">
	<cfset variables.dsn = "mark_ora_dev" />
	
	<cffunction name="get_sample_data" access="remote" returnformat="json">
		<cfargument name="well_code"
			type="numeric"
			hint="the artifical well key" />
		
		<cfargument name="rpt_yr_range"
			type="struct"
			hint="can provide a start and end year.  defaults are: start=1985, end=current year" />
			
		<cfargument name="conc_gt"
			type="numeric"
			hint="amount detected (in parts per billion) greater than" />
			
		<cfargument name="chem_in"
			type="array"
			hint="chemical code(s) found in wellinv.wichem" />
		
		<cfquery datasource="#variables.dsn#" name="records">
		SELECT wk.WELL_KEY as well_code, 
			wd.AGENCY as agency_code, 
			wd.STUDY as study_number, 
			wd.SDATE as sample_date, 
			wd.NCHEM as chemical_code, 
			wd.STYPE as sample_type, 
			wd.CONC as chemical_concentration, 
			wd.MDL as minimum_detection_level, 
			wd.METHOD as method_type, 
			wd.METHOD_NOTE as method_note, 
			wd.ADATE as analysis_date, 
			wd.RPT_YR as report_year, 
			wd.WATD as water_depth, 
			wd.PORN as contamination_source, 
			wd.STATUS as status
		
		FROM
			WELLINV.WIDATA wd, WELLINV.WIWELLKEY wk
		
		WHERE wd.WELL = wk.WELL
		
		<cfif StructKeyExists(arguments,"well_code")>
		AND wk.well_key = <cfqueryparam value="#arguments.well_code#" />
		</cfif>
		
		<cfif StructKeyExists(arguments,"rpt_yr_range")>
			<cfparam name="arguments.rpt_yr_range.start" default="1985" />
			<cfparam name="arguments.rpt_yr_range.end" default="#Year(Now())#" />
			
			AND wd.RPT_YR BETWEEN 
				<cfqueryparam value="#arguments.rpt_yr_range['start']#" />
				AND 
				<cfqueryparam value="#arguments.rpt_yr_range['end']#" />
		</cfif>

		<cfif StructKeyExists(arguments,"conc_gt")>
		AND wd.CONC > <cfqueryparam value="#arguments.conc_gt#" />
		</cfif>
		
		<cfif StructKeyExists(arguments,"chem_in")>
		AND wd.NCHEM IN (<cfqueryparam value="#ArrayToList(arguments.chem_in)#" />)
		</cfif>
		</cfquery>
		
		<cfreturn records />
	</cffunction>
	
	<cffunction name="get_construction_data" access="remote" returnformat="json">
		<cfargument name="well_code"
			type="numeric"
			required="yes"
			hint="the artifical well key" />
		
		<cfquery datasource="#variables.dsn#" name="records">
		SELECT
			wk.well_key as well_code,
			wc.code,
			wc.depth,
			wc.mtrs,
			wc.co as county_code
			
		FROM
			WELLINV.WICONST wc,
			WELLINV.WIWELLKEY wk
		
		WHERE wc.WELL = wk.WELL
		AND wk.well_key = <cfqueryparam value="#arguments.well_code#" />
		</cfquery>
		
		<cfreturn records />
	</cffunction>
</cfcomponent>