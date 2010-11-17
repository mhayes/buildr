<cfcomponent output="no">
	<!--- COMMON --->
	<cfset variables.dsn = "mark_ora_dev" />
	
	<!--- REMOTE --->
	<cffunction name="get_sample_data" access="remote" returnformat="json">
		<cfargument name="well_code"
			type="numeric"
			hint="the artifical well key" />
		
		<cfargument name="rpt_yr_range"
			type="any"
			hint="year must be greater than or equal to 1985." />
			
		<cfargument name="conc_gt"
			type="numeric"
			hint="amount detected (in parts per billion) greater than" />
			
		<cfargument name="chem_in"
			type="array"
			hint="chemical code(s) found in wellinv.wichem" />
		
		<cfquery datasource="#variables.dsn#" name="records" result="qry">
		SELECT wk.WELL_KEY, wd.AGENCY, wd.STUDY, wd.SDATE, 
			wd.NCHEM, wd.STYPE, wd.CONC, wd.MDL, wd.METHOD, 
			wd.METHOD_NOTE, wd.ADATE, wd.RPT_YR, wd.WATD, 
			wd.PORN as SOURCE, wd.STATUS, wd.CO
		
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
	
</cfcomponent>